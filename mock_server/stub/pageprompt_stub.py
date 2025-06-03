def PagePrompt(detail):
    # 1페이지
    if(detail == "에르델 마법의 숲에서 사계절이 동시에 존재하는 정령들이 살고 있습니다. 봄 정령, 여름 정령, 가을 정령, 겨울 정령이 모두 함께 살고 있습니다. 어느 날, 숲에서 이상한 일이 일어나고, 정령들은 이를 해결하기 위해 모여듭니다."):
       return {
		"image_prompt" : "A magical forest with four seasons coexisting, featuring spring, summer, autumn, and winter spirits living together. The forest is experiencing strange occurrences, and the spirits gather to solve e issue."
        }
    # 2페이지
    elif(detail == "각 정령들은 서로 다른 능력과 성격으로 인해 의견이 분분합니다. 봄 정령은 활기차고 사랑스럽고, 여름 정령은 활발하고 에너지 넘치는 성격입니다. 가을 정령은 차분하고 따뜻한 성격이고, 겨울 정령은 차갑고 진지한 성격입니다.") : 
        return {
            "image_prompt": "A magical forest scene with four different seasons represented by colorful flowers, bright sun, beautiful autumn leaves, and mystical snowflakes, all coming together to create a harmonious and enchanting environment for young children to enjoy."
        }
    # 3페이지
    elif(detail == "정령들은 각자의 능력을 발휘하여 문제를 해결하려 하지만, 서로 다른 의견으로 인해 갈등이 발생합니다. 봄 정령은 꽃을 피우고 새싹을 자라게 하는 능력을 가지고 있고, 여름 정령은 태양의 힘을 빌려 열매를 열게 하는 능력을 가지고 있습니다. 가을 정령은 잎을 떨어뜨리고 수확을 돕는 능력을 가지고 있고, 겨울 정령은 눈을 내리고 동물을 보호하는 능력을 가지고 있습니다.") :
        return {
            "image_prompt": "A group of young fairies with colorful wings gather together to solve a problem, but their different opinions cause conflict. Despite this, they understand and respect each other's perspectives, working together to find a solution. As they work through the problem, they become closer and strive to develop their own unique abilities."
        }
    # 4페이지
    elif(detail == "정령들은 서로를 이해하고 존중하며, 함께 문제를 해결하는 방법을 찾아냅니다. 봄 정령은 여름 정령에게 태양의 힘을 빌려 열매를 열게 하는 방법을 알려주고, 여름 정령은 봄 정령에게 꽃을 피우고 새싹을 자라게 하는 방법을 알려줍니다. 가을 정령은 겨울 정령에게 잎을 떨어뜨리고 수확을 돕는 방법을 알려주고, 겨울 정령은 가을 정령에게 눈을 내리고 동물을 보호하는 방법을 알려줍니다.") :
        return {
            "image_prompt": "Fairies are on an adventure together. The spring fairy makes beautiful flowers bloom, the summer fairy brings more sunshine, the autumn fairy makes the maple leaves more beautiful, and the winter fairy makes more snowflakes fall, making the forest more mysterious. The fairies discover new things together on their adventure."
        }  
    # 5페이지
    elif(detail == "이를 통해 정령들은 더욱 친밀해지고, 각자의 능력을 더욱 발전시켜 나갑니다. 이제 에르델 마법의 숲은 더욱 아름다운 곳이 되었습니다. 정령들은 함께 협력하여 문제를 해결하고, 서로를 이해하고 존중하며, 함께 성장하는 모습을 보여주었습니다.") :
        return {
            "image_prompt": "A beautiful forest with blooming flowers, warm sunlight, colorful autumn leaves, and snowflakes falling, all living together in harmony and happiness."
        }